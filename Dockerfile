FROM anapsix/alpine-java:jre8

RUN apk upgrade --update && \
    apk add --update curl unzip && \
    curl -jksSLH "Cookie: oraclelicense=accept-securebackup-cookie" -o /tmp/unlimited_jce_policy.zip "http://download.oracle.com/otn-pub/java/jce/8/jce_policy-8.zip" && \
    unzip -jo -d ${JAVA_HOME}/jre/lib/security /tmp/unlimited_jce_policy.zip

ENV TOMCAT_MAJOR=8 \
    TOMCAT_VERSION=8.5.3 \
    TOMCAT_HOME=/opt/tomcat \
    CATALINA_HOME=/opt/tomcat \
    CATALINA_OUT=/opt/tomcat/logs

RUN curl -jksSL -o /tmp/apache-tomcat.tar.gz http://archive.apache.org/dist/tomcat/tomcat-${TOMCAT_MAJOR}/v${TOMCAT_VERSION}/bin/apache-tomcat-${TOMCAT_VERSION}.tar.gz && \
    gunzip /tmp/apache-tomcat.tar.gz && \
    tar -C /opt -xf /tmp/apache-tomcat.tar && \
    ln -s /opt/apache-tomcat-${TOMCAT_VERSION} ${TOMCAT_HOME}

ADD jvmMemSettings.sh /jvmMemSettings.sh
RUN chmod +x /jvmMemSettings.sh
ENTRYPOINT ["/jvmMemSettings.sh"]

WORKDIR /tmp

#Copy SMK api
RUN wget -O /tmp/smks-api.war $APPBIN/smks-api/$SMKVER/smks-api-$SMKVER.war \
  && mkdir -p ${TOMCAT_HOME}/webapps/smks-api \
  && unzip /tmp/smks-api.war -d ${TOMCAT_HOME}/webapps/smks-api

#Copy client war
RUN wget -O /tmp/smk-client.war $APPBIN/smk-client/$SMKVER/smk-client-$SMKVER.war \
  && cp /tmp/smk-client.war ${TOMCAT_HOME}/webapps \
  && cp /tmp/smk-client.war ${TOMCAT_HOME}/webapps/smks-api/WEB-INF/classes/

#Copy SMK Admin UI
RUN wget -O /tmp/smk-ui.war $APPBIN/smk-ui/$SMKVER/smk-ui-$SMKVER.war \
  && cp /tmp/smk-ui.war ${TOMCAT_HOME}/webapps

RUN echo "couchdb.admin.password=password" >> ${TOMCAT_HOME}/webapps/smks-api/WEB-INF/classes/application.properties

# add a tomcat user
RUN adduser -S tomcat
RUN chown -R tomcat:0 `readlink -f ${CATALINA_HOME}` &&\
  chmod -R 770 `readlink -f ${CATALINA_HOME}` &&\
  chown -h tomcat:0 ${CATALINA_HOME}

# run as tomcat user
USER tomcat

EXPOSE 8080
WORKDIR ${CATALINA_HOME}/bin

CMD ./catalina.sh run

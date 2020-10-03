###### [SMK](../../../..) / [Configuration](../../..) / [Layers](../..) / [Query](..)

# Layer Query Predicate

The query predicate is a test to be executed against the features of the layer.

There are 2 types of predicate operators, those for testing an attribute's value, and those for combining the predicates.

There are operators for testing the value of an attribute:

<pre>
{ "predicate": { "operator": <a href="equals"       >"equals"</a>       } }
{ "predicate": { "operator": <a href="less-than"    >"less-than"</a>    } }
{ "predicate": { "operator": <a href="greater-than" >"greater-than"</a> } }
{ "predicate": { "operator": <a href="contains"     >"contains"</a>     } }
{ "predicate": { "operator": <a href="starts-with"  >"starts-with"</a>  } }
{ "predicate": { "operator": <a href="ends-with"    >"ends-with"</a>    } }
</pre>

There are operators for combining predicates:

<pre>
{ "predicate": { "operator": <a href="and"          >"and"</a>          } }
{ "predicate": { "operator": <a href="or"           >"or"</a>           } }
{ "predicate": { "operator": <a href="not"          >"not"</a>          } }
</pre>


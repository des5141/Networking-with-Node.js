///remove_modifier(string)
/*
\0 = normal
\1 = shaky
\2 = rotating
\3 = wave
\4 = color shift
*/
str = argument0;
return string_replace_all(string_replace_all(string_replace_all(string_replace_all(string_replace_all(string_replace_all(str,"\5",""),"\4",""),"\3",""),"\2",""),"\1",""),"\0","");

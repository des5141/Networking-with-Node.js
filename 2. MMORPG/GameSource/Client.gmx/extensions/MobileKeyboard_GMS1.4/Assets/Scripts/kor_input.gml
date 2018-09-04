var outtext = ""
// First Typing Status
if kor_word1 = -1 and kor_word2 = -1 and kor_word3 = 0
{
    if ds_list_find_index(kor_list1,argument0) > -1 {kor_word1 = ds_list_find_index(kor_list1,argument0) ; return ""} // Input Consonant
    if ds_list_find_index(kor_list1b,argument0) > -1 {kor_word1 = ds_list_find_index(kor_list1b,argument0) ; return ""} // Input Consonant Upper
    if ds_list_find_index(kor_list2,argument0) > -1 {kor_word2 = ds_list_find_index(kor_list2,argument0) ; return ""} // Input Vowel
    if ds_list_find_index(kor_list2b,argument0) > -1 {kor_word2 = ds_list_find_index(kor_list2b,argument0) ; return ""} // Input Vowel Upper
}
// Second Typing Status , Consonant Status
if kor_word1 > -1 and kor_word2 = -1 and kor_word3 = 0
{
    if ds_list_find_index(kor_list1,argument0) > -1 // Input Consonant
    {
        if ds_list_find_index(kor_list1,ds_list_find_value(kor_list1,kor_word1)+ds_list_find_value(kor_list1,ds_list_find_index(kor_list1,argument0))) > -1
        {kor_word1 = ds_list_find_index(kor_list1,ds_list_find_value(kor_list1,kor_word1)+ds_list_find_value(kor_list1,ds_list_find_index(kor_list1,argument0))) ; return ""}
        else {outtext = kor_load() ; kor_word1 = ds_list_find_index(kor_list1,argument0) ; return outtext}
    }
    if ds_list_find_index(kor_list1b,argument0) > -1 // Input Consonant Upper
    {
        if ds_list_find_index(kor_list1b,ds_list_find_value(kor_list1b,kor_word1)+ds_list_find_value(kor_list1b,ds_list_find_index(kor_list1b,argument0))) > -1
        {kor_word1 = ds_list_find_index(kor_list1b,ds_list_find_value(kor_list1b,kor_word1)+ds_list_find_value(kor_list1b,ds_list_find_index(kor_list1b,argument0))) ; return ""}
        else {outtext = kor_load() ; kor_word1 = ds_list_find_index(kor_list1b,argument0) ; return outtext}
    }
    if ds_list_find_index(kor_list2,argument0) > -1 {kor_word2 = ds_list_find_index(kor_list2,argument0) ; return ""} // Input Vowel
    if ds_list_find_index(kor_list2b,argument0) > -1 {kor_word2 = ds_list_find_index(kor_list2b,argument0) ; return ""} // Input Vowel Upper
}
// Third Typing Status , Consonant+Vowel Status
if kor_word1 > -1 and kor_word2 > -1 and kor_word3 = 0 
{
    if ds_list_find_index(kor_list1s,argument0) > -1 // Input Consonant
    {
    if ds_list_find_index(kor_list3,argument0) > -1 // Final Consonant
    {kor_word3 = ds_list_find_index(kor_list3,argument0) ; return ""}
    else // NOT Final Consonant
    {outtext = kor_load() ; kor_reset() ; kor_word1 = ds_list_find_index(kor_list1,argument0) ; return outtext}
    }
    if ds_list_find_index(kor_list1b,argument0) > -1 // Input Consonant Upper
    {
    if ds_list_find_index(kor_list3b,argument0) > -1 // Final Consonant
    {kor_word3 = ds_list_find_index(kor_list3b,argument0) ; return ""}
    else // NOT Final Consonant
    {outtext = kor_load() ; kor_reset() ; kor_word1 = ds_list_find_index(kor_list1b,argument0) ; return outtext}
    }
    if ds_list_find_index(kor_list2,argument0) > -1 // Input Vowel
    {
        if ds_list_find_index(kor_list2,ds_list_find_value(kor_list2,kor_word2)+ds_list_find_value(kor_list2,ds_list_find_index(kor_list2,argument0))) > -1
        {kor_word2 = ds_list_find_index(kor_list2,ds_list_find_value(kor_list2,kor_word2)+ds_list_find_value(kor_list2,ds_list_find_index(kor_list2,argument0))) ; return ""}
        else
        {outtext = kor_load() ; kor_reset() ; kor_word2 = ds_list_find_index(kor_list2,argument0) ; return outtext}
    }
    if ds_list_find_index(kor_list2b,argument0) > -1 // Input Vowel Upper
    {
        if ds_list_find_index(kor_list2b,ds_list_find_value(kor_list2,kor_word2)+ds_list_find_value(kor_list2b,ds_list_find_index(kor_list2b,argument0))) > -1
        {kor_word2 = ds_list_find_index(kor_list2b,ds_list_find_value(kor_list2,kor_word2)+ds_list_find_value(kor_list2b,ds_list_find_index(kor_list2b,argument0))) ; return ""}
        else
        {outtext = kor_load() ; kor_reset() ; kor_word2 = ds_list_find_index(kor_list2b,argument0) ; return outtext}
    }
}
// Another Typing Status , Consonant+Vowel+Final Consonant Status
if kor_word1 > -1 and kor_word2 > -1 and kor_word3 > 0
{
    if ds_list_find_index(kor_list1s,argument0) > -1 // Input Consonant
    {
        if ds_list_find_index(kor_list3,ds_list_find_value(kor_list3,kor_word3)+ds_list_find_value(kor_list1s,ds_list_find_index(kor_list1s,argument0))) > -1
        {kor_word3 = ds_list_find_index(kor_list3,ds_list_find_value(kor_list3,kor_word3)+ds_list_find_value(kor_list1s,ds_list_find_index(kor_list1s,argument0))) ; return ""}
        // is Double Consonant
        else
        {
        outtext = kor_load() ; kor_reset() ; kor_word1 = ds_list_find_index(kor_list1,argument0) ; return outtext
        }
    }
    if ds_list_find_index(kor_list1b,argument0) > -1 // Input Consonant Upper
    { 
        outtext = kor_load() ; kor_reset() ; kor_word1 = ds_list_find_index(kor_list1b,argument0) ; return outtext
    }
    if ds_list_find_index(kor_list2,argument0) > -1 // Input Vowel
    {
        if ds_list_find_index(kor_list1s,ds_list_find_value(kor_list3,kor_word3)) > -1 // Final Consonant is NOT Double Consonant
            {var save = ds_list_find_index(kor_list1,ds_list_find_value(kor_list3,kor_word3)) ; kor_word3 = 0 ; outtext = kor_load() ; kor_word1 = save ; kor_word2 = ds_list_find_index(kor_list2,argument0) ; return outtext}
        if string_length(ds_list_find_value(kor_list3,kor_word3)) = 2 // Final Consonant is Double Consonant
            {var save = ds_list_find_index(kor_list1,string_copy(ds_list_find_value(kor_list3,kor_word3),2,1)) ; kor_word3 = ds_list_find_index(kor_list3,string_copy(ds_list_find_value(kor_list3,kor_word3),1,1)) ; outtext = kor_load() ; kor_reset() ; kor_word1 = save ; kor_word2 = ds_list_find_index(kor_list2,argument0) ; return outtext}
    }
    if ds_list_find_index(kor_list2b,argument0) > -1 // Input Vowel Upper
    {
        if ds_list_find_index(kor_list1s,ds_list_find_value(kor_list3,kor_word3)) > -1 // Final Consonant is NOT Double Consonant
            {var save = ds_list_find_index(kor_list1,ds_list_find_value(kor_list3,kor_word3)) ; kor_word3 = 0 ; outtext = kor_load() ; kor_word1 = save ; kor_word2 = ds_list_find_index(kor_list2b,argument0) ; return outtext}
        if string_length(ds_list_find_value(kor_list3,kor_word3)) = 2 // Final Consonant is Double Consonant
            {var save = ds_list_find_index(kor_list1,string_copy(ds_list_find_value(kor_list3,kor_word3),2,1)) ; kor_word3 = ds_list_find_index(kor_list3,string_copy(ds_list_find_value(kor_list3,kor_word3),1,1)) ; outtext = kor_load() ; kor_reset() ; kor_word1 = save ; kor_word2 = ds_list_find_index(kor_list2b,argument0) ; return outtext}
    }
}
// Only Vowel Status
if kor_word1 = -1 and kor_word2 > -1 and kor_word3 = 0
{
    if ds_list_find_index(kor_list1,argument0) > -1 {outtext = kor_load() ; kor_reset() ; kor_word1 = ds_list_find_index(kor_list1,argument0) ; return outtext} // Input Consonant
    if ds_list_find_index(kor_list1b,argument0) > -1 {outtext = kor_load() ; kor_reset() ; kor_word1 = ds_list_find_index(kor_list1b,argument0) ; return outtext} // Input Consonant Upper
    if ds_list_find_index(kor_list2,argument0) > -1 // Input Vowel
    {
        if ds_list_find_index(kor_list2,ds_list_find_value(kor_list2,kor_word2)+ds_list_find_value(kor_list2,ds_list_find_index(kor_list2,argument0))) > -1
        {kor_word2 = ds_list_find_index(kor_list2,ds_list_find_value(kor_list2,kor_word2)+ds_list_find_value(kor_list2,ds_list_find_index(kor_list2,argument0))) ; return ""}
        else
        {outtext = kor_load() ; kor_word2 = ds_list_find_index(kor_list2,argument0) ; return outtext}
    }
        if ds_list_find_index(kor_list2b,argument0) > -1// Input Vowel Upper
    {
        if ds_list_find_index(kor_list2,ds_list_find_value(kor_list2,kor_word2)+ds_list_find_value(kor_list2,ds_list_find_index(kor_list2b,argument0))) > -1
        {kor_word2 = ds_list_find_index(kor_list2,ds_list_find_value(kor_list2,kor_word2)+ds_list_find_value(kor_list2,ds_list_find_index(kor_list2b,argument0))) ; return ""}
        else
        {outtext = kor_load() ; kor_word2 = ds_list_find_index(kor_list2b,argument0) ; return outtext}
    }
}
return ""

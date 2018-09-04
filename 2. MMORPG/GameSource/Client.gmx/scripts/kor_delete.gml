if kor_word3 > 0
{
if string_length(ds_list_find_value(kor_list3,kor_word3)) = 2
{kor_word3 = ds_list_find_index(kor_list3,string_copy(ds_list_find_value(kor_list3,kor_word3),1,1)) ; return false}
else
{kor_word3 = 0 ; return false}
}
if kor_word2 > -1
{
if string_length(ds_list_find_value(kor_list2,kor_word2)) = 2
{kor_word2 = ds_list_find_index(kor_list2,string_copy(ds_list_find_value(kor_list2,kor_word2),1,1)) ; return false}
else
{kor_word2 = -1 ; return false}
}
if kor_word1 > -1
{
if string_length(ds_list_find_value(kor_list1,kor_word1)) = 2
{kor_word1 = ds_list_find_index(kor_list1,string_copy(ds_list_find_value(kor_list1,kor_word1),1,1)) ; return false}
else
{kor_word1 = -1 ; return false}
}
return true

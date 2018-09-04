var text = 0
if kor_word1 >= 0 and kor_word2 = -1 and kor_word3 = 0 {text = 12593+kor_word1}
if kor_word1 = -1 and kor_word2 >= 0 and kor_word3 = 0 {text = 12623+kor_word2}
if kor_word1 >= 0 and kor_word2 >= 0 {text = 44032+ds_list_find_index(kor_list1s,ds_list_find_value(kor_list1,kor_word1))*588+kor_word2*28+kor_word3}
if text != 0 {return chr(text)}
else {return ""}

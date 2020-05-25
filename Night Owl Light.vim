" ===============================================================
" Night Owl Light

set background=
hi clear

if exists("syntax_on")
syntax reset
endif

let g:colors_name="Night Owl Light"

hi Normal guifg=#403f53 ctermfg=60 guibg=#FBFBFB ctermbg=231
hi Comment guifg=#989fb1 ctermfg=145 guibg=#FBFBFB ctermbg=231
hi Boolean guifg=#bc5454 ctermfg=174 guibg=#FBFBFB ctermbg=231
hi LineNr guifg=#90A7B2 ctermfg=145 guibg=#FBFBFB ctermbg=231

" ===============================================================
" udt

set background=
hi clear

if exists("syntax_on")
syntax reset
endif

let g:colors_name="udt"

hi Normal guifg=#333333 ctermfg=236 guibg=#f5f5f5 ctermbg=255
hi Comment guifg=#a8528b ctermfg=139 guibg=#f5f5f5 ctermbg=255
hi Boolean guifg=#044bae ctermfg=25 guibg=#f5f5f5 ctermbg=255
hi LineNr guifg=#3333334d ctermfg=236 guibg=#f5f5f5 ctermbg=255
hi Cursor guifg=#cc0000 ctermfg=160 guibg=#f5f5f5 ctermbg=255
hi CursorLine guifg= ctermfg= guibg=#3333330a ctermbg=236

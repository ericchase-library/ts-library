wsl bash -lc "bun test --coverage"
wsl bash -lc "genhtml ./coverage/lcov.info -o ./coverage/report/"

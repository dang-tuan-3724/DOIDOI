LƯU Ý: Chỉ cài node module trong thư mục doidoi-app (thư mục FE), không cài ở thư mục lớn ở ngoài
B1: cd doidoi-app
B2: (chỉ làm 1 lần đầu) npm install để cài đặt các module cần thiết
B3: npx expo start

./doidoi-app/api/apiManager.ts sửa local_ip thành your ip local device 192.168.x.x

Git commit:
message: .... to ....
feat: thêm tính năng mới ----- feat(author): add file/folder to ....
fix: sửa lỗi trong mã nguồn -- fix(): fix ? to ?
docs: cập nhật tài liệu ------ docs: add instruction in README.md
style: thay đổi liên quan đến style
refactor: sửa đổi cấu trúc mã nguồn
perf: tăng hiệu suất
build: thay đổi, thêm, xoá thư viện, dependencies 
chore: cập nhật không liên quan tới tính năng
revert: hoàn tác cái gì đó

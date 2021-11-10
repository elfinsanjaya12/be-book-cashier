users :

- id int
- name string
- email string
- password string
- role enum[admin, kasir] (optional)

categories :

- id int
- name string
- userId int

products :

- id int
- categoryId int
- title string
- auhtor string
- image string
- published date
- price int
- stock
- userId int

detail-transactions :

- id
- transactionId int
- productId int
- productHistoryId int
- titleProduct string
- auhtorProduct string
- imageProduct string
- priceProduct int
- quantity int

transactions :

- id int
- invoice string
- date date
- userId int

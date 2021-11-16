users :

- id int
- name string
- email string
- password string
- role enum[admin, kasir] (optional)

categories :

- id int
- name string
- user int

products :

- id int
- category int
- title string
- auhtor string
- image string
- published date
- price int
- stock
- user int
- \

detail-transactions :

- id
- transaction int
- product int
- productHistory int
- titleProduct string
- auhtorProduct string
- imageProduct string
- priceProduct int
- quantity int

transactions :

- id int
- invoice string
- date date
- user int

CREATE TABLE products (
    id serial NOT NULL,
    name varchar(50) not null,
    price numeric(11,2) NOT NULL,
    description varchar(200) NOT NULL,
    CONSTRAINT product_pk PRIMARY KEY (id)
);
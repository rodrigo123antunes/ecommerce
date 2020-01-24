-- DROP TABLE public."user";

CREATE TABLE public."user" (
	id serial NOT NULL,
	"name" varchar NOT NULL,
	email varchar NOT NULL,
	"password" varchar NOT NULL,
	perfil perfil NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY (id)
);

CREATE TABLE Category (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT,
    role SMALLINT DEFAULT 0, -- 0 = user, 1 = admin
    created_at TIMESTAMP,
    modified_at TIMESTAMP
);

CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INT REFERENCES Category(id),
    user_id INT REFERENCES Users(id),
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    votes INT DEFAULT 0,
    created_at TIMESTAMP,
    modified_at TIMESTAMP
);

CREATE TABLE Votes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
    vote_type SMALLINT NOT NULL CHECK (vote_type IN (1, -1)),
    created_at TIMESTAMP
);

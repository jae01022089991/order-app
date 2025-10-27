-- Drop tables if they exist to ensure a clean slate
DROP TABLE IF EXISTS order_item_options, order_items, orders, menu_options, options, menus CASCADE;

-- menus table
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    image_url VARCHAR(255),
    stock INTEGER NOT NULL DEFAULT 0
);

-- options table
CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL DEFAULT 0
);

-- menu_options junction table
CREATE TABLE menu_options (
    menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
    option_id INTEGER REFERENCES options(id) ON DELETE CASCADE,
    PRIMARY KEY (menu_id, option_id)
);

-- orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) NOT NULL DEFAULT '주문 접수',
    total_price INTEGER NOT NULL
);

-- order_items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_id INTEGER REFERENCES menus(id),
    quantity INTEGER NOT NULL,
    price_per_item INTEGER NOT NULL
);

-- order_item_options junction table
CREATE TABLE order_item_options (
    order_item_id INTEGER REFERENCES order_items(id) ON DELETE CASCADE,
    option_id INTEGER REFERENCES options(id),
    PRIMARY KEY (order_item_id, option_id)
);

-- Insert some sample data
INSERT INTO menus (name, description, price, image_url, stock) VALUES
('아메리카노(ICE)', '시원하고 깔끔한 아이스 아메리카노', 4000, '/images/ice-americano.jpg', 100),
('아메리카노(HOT)', '따뜻한 물과 에스프레소로 만든 아메리카노', 4000, '/images/americano-hot.jpg', 100),
('카페라떼(ICE)', '부드러운 우유와 시원한 에스프레소의 조화', 4500, '/images/caffe-latte.jpg', 100);

INSERT INTO options (name, price) VALUES
('샷 추가', 500),
('시럽 추가', 300),
('디카페인', 700);

-- Link options to menus
INSERT INTO menu_options (menu_id, option_id) VALUES
(1, 1), -- 아메리카노 -> 샷 추가
(1, 2), -- 아메리카노 -> 시럽 추가
(2, 1), -- 카페라떼 -> 샷 추가
(2, 3), -- 카페라떼 -> 디카페인
(3, 1), -- 바닐라 라떼 -> 샷 추가
(3, 3); -- 바닐라 라떼 -> 디카페인

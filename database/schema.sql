-- Couples App Database Schema
-- PostgreSQL

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_username ON users(username);

-- Couples table
CREATE TABLE IF NOT EXISTS couples (
    id BIGSERIAL PRIMARY KEY,
    user1_id BIGINT NOT NULL,
    user2_id BIGINT NOT NULL,
    paired_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user1 FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user2 FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user1 UNIQUE (user1_id),
    CONSTRAINT unique_user2 UNIQUE (user2_id)
);

CREATE INDEX idx_user1 ON couples(user1_id);
CREATE INDEX idx_user2 ON couples(user2_id);

-- Pairing codes table
CREATE TABLE IF NOT EXISTS pairing_codes (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(6) NOT NULL,
    owner_user_id BIGINT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_owner FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_code ON pairing_codes(code);
CREATE INDEX idx_owner ON pairing_codes(owner_user_id);

-- Slideshow images table
CREATE TABLE IF NOT EXISTS slideshow_images (
    id BIGSERIAL PRIMARY KEY,
    couple_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    order_index INTEGER NOT NULL,
    uploaded_by_user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_couple_slideshow FOREIGN KEY (couple_id) REFERENCES couples(id) ON DELETE CASCADE,
    CONSTRAINT fk_uploader_slideshow FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_couple_slideshow ON slideshow_images(couple_id);
CREATE INDEX idx_order_slideshow ON slideshow_images(couple_id, order_index);

-- Quick messages table
CREATE TABLE IF NOT EXISTS quick_messages (
    id BIGSERIAL PRIMARY KEY,
    couple_id BIGINT NOT NULL,
    content VARCHAR(50) NOT NULL,
    created_by_user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_couple_message FOREIGN KEY (couple_id) REFERENCES couples(id) ON DELETE CASCADE,
    CONSTRAINT fk_creator_message FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_couple_message ON quick_messages(couple_id);


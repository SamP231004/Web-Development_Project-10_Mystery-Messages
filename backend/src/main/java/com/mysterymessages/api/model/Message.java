package com.mysterymessages.api.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;

public class Message {

    @Id
    private String id;
    private String content;
    private Instant createdAt = Instant.now();

    public Message() {
    }

    public Message(String content) {
        this.content = content;
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String get_id() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

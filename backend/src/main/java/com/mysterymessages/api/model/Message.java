package com.mysterymessages.api.model;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

public class Message {

    @Id
    @Field("_id")
    private String id;
    private String content;
    private Instant createdAt = Instant.now();

    public Message() {
    }

    public Message(String content) {
        this.content = content;
        this.createdAt = Instant.now();
    }

    @JsonProperty("_id")
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

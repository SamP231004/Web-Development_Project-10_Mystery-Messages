package com.mysterymessages.api.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    @JsonIgnore
    private String password;
    @JsonIgnore
    private String verifyCode;
    @JsonIgnore
    private Instant verifyCodeExpiry;
    @Field("isVerified")
    private boolean isVerified;
    @Field("isAcceptingMessages")
    private boolean isAcceptingMessages = true;
    private List<Message> messages = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String get_id() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getVerifyCode() {
        return verifyCode;
    }

    public void setVerifyCode(String verifyCode) {
        this.verifyCode = verifyCode;
    }

    public Instant getVerifyCodeExpiry() {
        return verifyCodeExpiry;
    }

    public void setVerifyCodeExpiry(Instant verifyCodeExpiry) {
        this.verifyCodeExpiry = verifyCodeExpiry;
    }

    @JsonProperty("isVerified")
    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    @JsonProperty("isAcceptingMessages")
    public boolean isAcceptingMessages() {
        return isAcceptingMessages;
    }

    public void setAcceptingMessages(boolean acceptingMessages) {
        isAcceptingMessages = acceptingMessages;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
}

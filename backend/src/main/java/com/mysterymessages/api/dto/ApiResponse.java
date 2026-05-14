package com.mysterymessages.api.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mysterymessages.api.model.Message;
import com.mysterymessages.api.model.User;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse {

    private Boolean success;
    private String message;
    private Boolean isAcceptingMessages;
    private List<Message> messages;
    private User updateUser;
    private String token;
    private User user;

    public static ApiResponse success(String message) {
        ApiResponse response = new ApiResponse();
        response.setSuccess(true);
        response.setMessage(message);
        return response;
    }

    public static ApiResponse failure(String message) {
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage(message);
        return response;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getIsAcceptingMessages() {
        return isAcceptingMessages;
    }

    public void setIsAcceptingMessages(Boolean acceptingMessages) {
        isAcceptingMessages = acceptingMessages;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public User getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(User updateUser) {
        this.updateUser = updateUser;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

package com.mysterymessages.api.service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.mysterymessages.api.dto.AcceptMessagesRequest;
import com.mysterymessages.api.dto.ApiResponse;
import com.mysterymessages.api.dto.SendMessageRequest;
import com.mysterymessages.api.exception.ApiException;
import com.mysterymessages.api.model.Message;
import com.mysterymessages.api.model.User;
import com.mysterymessages.api.repository.UserRepository;

@Service
public class MessageService {

    private final UserRepository userRepository;

    public MessageService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ApiResponse sendMessage(SendMessageRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User does not seem to exist"));

        if (!user.isAcceptingMessages()) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Looks like this user is not accepting messages");
        }

        Message message = new Message(request.content());
        message.setId(new ObjectId().toHexString());
        message.setCreatedAt(Instant.now());
        user.getMessages().add(message);
        userRepository.save(user);

        return ApiResponse.success("Message sent successfully !");
    }

    public ApiResponse getMessages(User user) {
        List<Message> messages = user.getMessages().stream()
                .sorted(Comparator.comparing(Message::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .toList();

        ApiResponse response = new ApiResponse();
        response.setMessages(messages);
        return response;
    }

    public ApiResponse updateAcceptingMessages(User user, AcceptMessagesRequest request) {
        user.setAcceptingMessages(request.acceptMessages());
        User updated = userRepository.save(user);

        ApiResponse response = ApiResponse.success("Message acceptance status updated successfully");
        response.setUpdateUser(updated);
        return response;
    }

    public ApiResponse getAcceptingMessages(User user) {
        ApiResponse response = new ApiResponse();
        response.setSuccess(true);
        response.setIsAcceptingMessages(user.isAcceptingMessages());
        return response;
    }

    public ApiResponse deleteMessage(User user, String messageId) {
        boolean removed = user.getMessages().removeIf(message -> messageId.equals(message.getId()));
        if (!removed) {
            throw new ApiException(HttpStatus.NOT_FOUND, "We looked everywhere, but that message is missing");
        }
        userRepository.save(user);
        return ApiResponse.success("Message deleted successfully");
    }
}

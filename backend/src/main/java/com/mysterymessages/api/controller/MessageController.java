package com.mysterymessages.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mysterymessages.api.dto.AcceptMessagesRequest;
import com.mysterymessages.api.dto.ApiResponse;
import com.mysterymessages.api.dto.SendMessageRequest;
import com.mysterymessages.api.dto.SuggestMessagesResponse;
import com.mysterymessages.api.model.User;
import com.mysterymessages.api.service.CurrentUserService;
import com.mysterymessages.api.service.MessageService;
import com.mysterymessages.api.service.SuggestionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class MessageController {

    private final MessageService messageService;
    private final SuggestionService suggestionService;
    private final CurrentUserService currentUserService;

    public MessageController(
            MessageService messageService,
            SuggestionService suggestionService,
            CurrentUserService currentUserService) {
        this.messageService = messageService;
        this.suggestionService = suggestionService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/send-messages")
    public ResponseEntity<ApiResponse> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(messageService.sendMessage(request));
    }

    @PostMapping("/suggest-messages")
    public ResponseEntity<SuggestMessagesResponse> suggestMessages() {
        return ResponseEntity.ok(new SuggestMessagesResponse(suggestionService.suggestMessages()));
    }

    @GetMapping("/get-messages")
    public ResponseEntity<ApiResponse> getMessages(Authentication authentication) {
        User user = currentUserService.requireUser(authentication);
        return ResponseEntity.ok(messageService.getMessages(user));
    }

    @GetMapping("/accept-messages")
    public ResponseEntity<ApiResponse> getAcceptMessages(Authentication authentication) {
        User user = currentUserService.requireUser(authentication);
        return ResponseEntity.ok(messageService.getAcceptingMessages(user));
    }

    @PostMapping("/accept-messages")
    public ResponseEntity<ApiResponse> updateAcceptMessages(
            Authentication authentication,
            @Valid @RequestBody AcceptMessagesRequest request) {
        User user = currentUserService.requireUser(authentication);
        return ResponseEntity.ok(messageService.updateAcceptingMessages(user, request));
    }

    @DeleteMapping("/delete-messages/{messageId}")
    public ResponseEntity<ApiResponse> deleteMessage(
            Authentication authentication,
            @PathVariable String messageId) {
        User user = currentUserService.requireUser(authentication);
        return ResponseEntity.ok(messageService.deleteMessage(user, messageId));
    }
}

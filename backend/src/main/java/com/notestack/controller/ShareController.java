package com.notestack.controller;

import com.notestack.dto.NoteResponseDto;
import com.notestack.service.NoteService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ShareController {

    private final NoteService noteService;

    public ShareController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping("/s/{token}")
    public String viewSharedNote(@PathVariable String token, Model model) {
        try {
            NoteResponseDto note = noteService.getNoteByShareToken(token);
            model.addAttribute("note", note);
            return "share";
        } catch (Exception e) {
            model.addAttribute("error", "The note you are looking for does not exist or the link has expired.");
            return "error";
        }
    }
}

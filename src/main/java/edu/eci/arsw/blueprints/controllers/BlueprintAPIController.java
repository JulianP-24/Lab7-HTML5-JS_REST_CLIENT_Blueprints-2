/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.controllers;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import edu.eci.arsw.blueprints.services.BlueprintsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author hcadavid
 */
@RestController
@RequestMapping(value = "/blueprints")
public class BlueprintAPIController {
    @Autowired
    @Qualifier("BlueprintsServices")
    BlueprintsServices blueprintsServices;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> getBlueprints() {
        try {
            Set<Blueprint> blueprintSet = blueprintsServices.getAllBlueprints();
            return new ResponseEntity<>(blueprintSet, HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/{author}")
    public ResponseEntity<?> getBlueprintsByAuthor (@PathVariable String author){
        try{
            Set<Blueprint> blueprintsByAuthor = blueprintsServices.getBlueprintsByAuthor(author);
            return new ResponseEntity<>(blueprintsByAuthor, HttpStatus.ACCEPTED);
        }catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/{author}/{bpname}")
    public ResponseEntity<?> getBlueprintsByAuthorAndName (@PathVariable String author, @PathVariable String bpname){
        try{
            Blueprint blueprintsByAuthorAndName = blueprintsServices.getBlueprint(author, bpname);
            return new ResponseEntity<>(blueprintsByAuthorAndName, HttpStatus.ACCEPTED);
        }catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> addBlueprint(@RequestBody Blueprint bp ){
        try {
            blueprintsServices.addNewBlueprint(bp);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error",HttpStatus.FORBIDDEN);
        }
    }

    @RequestMapping(method = RequestMethod.PUT, value = "/{author}/{bpname}")
    @ResponseBody
    public synchronized ResponseEntity<?> putBlueprint(@PathVariable String author, @PathVariable String bpname,@RequestBody Blueprint bp ){
        try {
            blueprintsServices.updateBlueprint(author, bpname, bp);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error",HttpStatus.NOT_FOUND);
        }
    }
}





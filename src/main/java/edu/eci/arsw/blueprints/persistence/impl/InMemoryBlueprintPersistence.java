/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.persistence.impl;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 *
 * @author hcadavid
 */
//@Component("bpp")
@Service("InMemoryBlueprintPersistence")
public class InMemoryBlueprintPersistence implements BlueprintsPersistence{

    private final ConcurrentHashMap<Tuple<String,String>,Blueprint> blueprints=new ConcurrentHashMap<>();

    public InMemoryBlueprintPersistence() {
        //load stub data
        Point[] pts1=new Point[]{new Point(50, 50),new Point(75, 75)};
        Point[] pts2=new Point[]{new Point(100, 100),new Point(30, 30)};
        Point[] pts3=new Point[]{new Point(170, 170),new Point(125, 125)};

        Blueprint bp1=new Blueprint("JulianPe", "blueprint1",pts1);
        Blueprint bp2=new Blueprint("JulianPe", "blueprint2",pts2);
        Blueprint bp3=new Blueprint("PistaKarts", "blueprint3",pts3);

        blueprints.put(new Tuple<>(bp1.getAuthor(),bp1.getName()), bp1);
        blueprints.put(new Tuple<>(bp2.getAuthor(),bp2.getName()), bp2);
        blueprints.put(new Tuple<>(bp3.getAuthor(),bp3.getName()), bp3);
        
    }    

    @Override
    public Set<Blueprint> getAllBlueprints() throws  BlueprintNotFoundException{
        return  blueprints.values().stream().collect(Collectors.toSet());
    }

    @Override
    public void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        if (blueprints.containsKey(new Tuple<>(bp.getAuthor(),bp.getName()))){
            throw new BlueprintPersistenceException("The given blueprint already exists: "+bp);
        }
        else{
            blueprints.put(new Tuple<>(bp.getAuthor(),bp.getName()), bp);
        }        
    }

    @Override
    public Blueprint getBlueprint(String author, String bprintname) throws BlueprintNotFoundException {
        return blueprints.get(new Tuple<>(author, bprintname));
    }

    @Override
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws  BlueprintNotFoundException{
        return blueprints.values().stream().filter(x -> x.getAuthor().equals(author)).collect(Collectors.toSet());
    }

    @Override
    public void updateBlueprint(String author, String bpname, Blueprint newbp) throws BlueprintPersistenceException{
        Blueprint Blueprint = blueprints.putIfAbsent(new Tuple<>(newbp.getAuthor(), newbp.getName()),newbp);
        if(Blueprint != null){
            blueprints.replace(new Tuple<>(newbp.getAuthor(), newbp.getName()), Blueprint, newbp);
        }
    }
}

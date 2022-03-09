package edu.eci.arsw.blueprints.services;

import edu.eci.arsw.blueprints.model.*;

import java.util.ArrayList;
import java.util.List;


public class filtroSubmuestro implements filterBluePrints {

    public filtroSubmuestro(){

    }

    @Override
    public Blueprint filtro(Blueprint bp) {
        List<Point> oldPoints=bp.getPoints();
        ArrayList<Point> points=new ArrayList<Point>();
        for(int i=0;i<oldPoints.size();i++){
            if((i%2)==0){
                points.add(oldPoints.get(i));
            }
        }
        return new Blueprint(bp.getAuthor(),bp.getName(),points);
    }
}

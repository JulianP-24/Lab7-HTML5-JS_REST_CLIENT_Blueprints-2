package edu.eci.arsw.blueprints.services;

import edu.eci.arsw.blueprints.model.*;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.lang.reflect.Array;
import java.util.ArrayList;

//@Component("filtroBp")
@Service("filtroRedundancia")
public class filtroRedundancia implements  filterBluePrints{

    public filtroRedundancia(){

    }

    @Override
    public Blueprint filtro(Blueprint bp) {
        boolean redundancia;
        ArrayList<Point> points =new ArrayList<>();
        for (Point i :bp.getPoints()){
            redundancia=false;
            for(Point j : points){
                if(i.equals(j)){
                    redundancia=true;
                    break;
                }
            }
            if(redundancia==false){
                points.add(i);
            }
        }
        return new Blueprint(bp.getAuthor(),bp.getName(),points);
    }
}

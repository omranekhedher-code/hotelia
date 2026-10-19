
package com.hotelia.hotelia_backend.room;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "numero", nullable = false)
    private Integer numero;

    @Column(name = "type", nullable = false, length = 100)
    private String type;

    @Column(name = "description", nullable = false, columnDefinition = "text")
    private String description;

    @Column(name = "prix_par_nuit", nullable = false)
    private Float prixParNuit;

    @Column(name = "capacite", nullable = false)
    private Integer capacite;

    @Column(name = "disponible", nullable = false, length = 500)
    private String disponible;

    @Column(name = "image", nullable = false, length = 1000)
    private String image;

    public Room() {
    }

    public Integer getId() {
        return id;
    }

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Float getPrixParNuit() {
        return prixParNuit;
    }

    public void setPrixParNuit(Float prixParNuit) {
        this.prixParNuit = prixParNuit;
    }

    public Integer getCapacite() {
        return capacite;
    }

    public void setCapacite(Integer capacite) {
        this.capacite = capacite;
    }

    public String getDisponible() {
        return disponible;
    }

    public void setDisponible(String disponible) {
        this.disponible = disponible;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}

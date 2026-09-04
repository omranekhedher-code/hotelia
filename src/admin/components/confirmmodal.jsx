import React from "react";


function ConfirmModal({isOpen, message, onConfirm, onCancel}){


  if(!isOpen){
    return null;
  }


  return (

    <div className="modal-overlay">


      <div className="confirm-modal">


        <h2>
          Confirmation
        </h2>


        <p>
          {message}
        </p>



        <div className="modal-actions">


          <button

            className="cancel-btn"

            onClick={onCancel}

          >

            Annuler

          </button>



          <button

            className="confirm-btn"

            onClick={onConfirm}

          >

            Supprimer

          </button>


        </div>


      </div>


    </div>

  );


}


export default ConfirmModal;
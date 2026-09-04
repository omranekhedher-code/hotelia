import React from "react";


function Pagination({currentPage, totalPages, setCurrentPage}){


  return (

    <div className="pagination">


      <button

        disabled={currentPage === 1}

        onClick={()=>setCurrentPage(currentPage - 1)}

      >

        Previous

      </button>



      {

        [...Array(totalPages)].map((_, index)=>(

          <button

            key={index}

            className={
              currentPage === index + 1 
              ? "active"
              : ""
            }

            onClick={()=>setCurrentPage(index + 1)}

          >

            {index + 1}

          </button>

        ))

      }



      <button

        disabled={currentPage === totalPages}

        onClick={()=>setCurrentPage(currentPage + 1)}

      >

        Next

      </button>



    </div>

  );


}


export default Pagination;
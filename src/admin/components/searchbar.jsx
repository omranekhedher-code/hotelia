import React from "react";


function SearchBar({search, setSearch}){


  return (

    <div className="search-bar">


      <input

        type="text"

        placeholder="Rechercher..."

        value={search}

        onChange={(e)=>setSearch(e.target.value)}

      />


    </div>

  );


}


export default SearchBar;
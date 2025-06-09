import React, { useState, useEffect } from "react";
import paginationPrev from "@/assets/icon/icon_page_prev.svg";
//image
import { commonImage } from "@/consts/image";
import { StyledPagination } from "./style";
//style

export const Pagination = ({ data, RenderComponent, title, pageLimit, dataLimit }) => {
    const [pages] = useState(Math.round(data.length / dataLimit));
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        window.scrollTo({ behavior: "smooth", top: 0 });
    }, [currentPage]);

    function goToNextPage() {
        setCurrentPage((page) => page + 1);
    }

    function goToPreviousPage() {
        setCurrentPage((page) => page - 1);
    }

    function changePage(event) {
        const pageNumber = Number(event.target.textContent);
        setCurrentPage(pageNumber);
    }

    const getPaginatedData = () => {
        const startIndex = currentPage * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        return data.slice(startIndex, endIndex);
    };

    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
        return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
    };

    return (
        <StyledPagination>

            {/* render data */}
            {/*<div className="dataContainer">*/}
            {/*    {getPaginatedData().map((d, idx) => (*/}
            {/*        <RenderComponent key={idx} data={d} />*/}
            {/*    ))}*/}
            {/*</div>*/}

            {/* pagination */}
            <div className="pagination">
                {/* previous  */}
                <button
                    onClick={goToPreviousPage}
                    className={`pageButton prev ${currentPage === 1 ? "disabled" : ""}`}
                >
                    <span className="icon">
                        <img src={commonImage.paginationPrev} alt="Prev"/>
                    </span>
                    <span>
                        Previous
                    </span>
                </button>

                {/* 몇페이지 */}
               <div className="numberGroup">
                   {getPaginationGroup().map((item, index) => (
                       <button
                           key={index}
                           onClick={changePage}
                           className={`paginationItem ${
                               currentPage === item ? "active" : null
                           }`}
                       >
                           <span>{item}</span>
                       </button>
                   ))}
               </div>

                {/* next  */}
                <button
                    onClick={goToNextPage}
                    className={`pageButton next ${currentPage === pages ? "disabled" : ""}`}
                >
                    <span>
                        Next
                    </span>
                    <span className="icon">
                        <img src={commonImage.paginationNext} alt="next"/>
                    </span>
                </button>
            </div>
        </StyledPagination>
    );
};


// "use client";
// import { SERVER_URL } from "@/lib/urql";
// import { withUrqlClient } from "next-urql";
// import React, { useEffect, useState } from "react";
// import { cacheExchange, fetchExchange } from "urql";
// import { Category, Programme, Skill } from "@/gql/graphql";
// import { parseJwt } from "@/lib/cryptr";
// import ResultBar from "../ResultBar";

// interface Props {
//   result: Programme[];
//   categories: Category[];
//   skills: Skill[];
// }

// const Result = (props: Props) => {
//   const [SelectedProgramme, setSelectedProgramme] = useState<Programme>();
//   const [isExcelUpload, setIsExcelUpload] = useState<boolean>(false);
//   const [search, setSearch] = useState<string>("");
//   const [data, setData] = useState<Programme[]>(props.result);
//   const [allData , setAllData] = useState<Programme[]>(props.result);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [SelectedProgrammes, setSelectedProgrammes] = useState<string[]>([]);

//   const itemsPerPage =  16;

//   useEffect(()=>{
//     const cookie = document.cookie;
//     if (cookie) {
//       const token = cookie.split("=")[1];
//       const cv = parseJwt(token);
//       setData( props.result.filter((item: any) => cv.categories?.includes(item.category.name)) as Programme[])
//       setAllData( props.result.filter((item: any) => cv.categories?.includes(item.category.name)) as Programme[])
//     }
//   },[])

//   // Calculate the index range for the current page
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;

//   // Get the data for the current page
//   const currentData = data.slice(startIndex, endIndex);

//   // Calculate the total number of pages
//   const totalPages = Math.ceil(data.length / itemsPerPage);

//   // Go to a specific page number
//   const goToPage = (pageNumber: number) => {
//     setCurrentPage(pageNumber);
//   };

//   // Render the pagination controls
//   const renderPaginationControls = () => {
//     const controls = [];
//     for (let page = 1; page <= totalPages; page++) {
//       controls.push(
//         <button
//           key={page}
//           onClick={() => goToPage(page)}
//           className={`${
//             currentPage === page ? "active" : ""
//           } w-5 h-5 bg-black mx-1 my-5`}
//         >
//           {page}
//         </button>
//       );
//     }
//     return controls;
//   };

//   function downloadExcel() {
//     const data = props.result;
//     const replacer = (key: any, value: any) => (value === null ? "" : value); // specify how you want to handle null values here
//     const header = Object.keys(data[0]);
//     let csv = data.map((row: any) =>
//       header
//         .map((fieldName) => JSON.stringify(row[fieldName], replacer))
//         .join(",")
//     );
//     csv.unshift(header.join(","));
//     let csvArray = csv.join("\r\n");

//     var a = document.createElement("a");
//     a.href = "data:attachment/csv," + csvArray;
//     a.target = "_Blank";
//     a.download = "Programme.csv";
//     document.body.appendChild(a);
//     a.click();
//   }

//   return (
//     <>
//       <div className="w-full h-full">
//         {/* <ResultBar data={{}} /> */}

//         <div className="w-full h-5/6 bg-base-200 rounded-lg mt-[1%]">
//           <div>
//             {/* search bar */}
//             <div className="w-full h-10 bg-base-300 rounded-lg mt-[1%] cursor-pointer">
//               <div className="w-1/3 h-full float-left">
//                 <input
//                   type="text"
//                   value={search}
//                   onChange={(e) => {
//                     setSearch(e.target.value);
//                     setCurrentPage(1);
//                     setData(
//                       allData.filter((item: Programme) =>
//                         item.name?.toLocaleLowerCase().includes(e.target.value?.toLocaleLowerCase())
//                         || item.programCode?.toLocaleLowerCase().includes(e.target.value?.toLocaleLowerCase())
//                       )
//                     );
//                   }}
//                 />
//               </div>
//               <div className="m-1 float-left">
//                 <button
//                   className="bg-blue-600"
//                   onClick={() => {
//                     setIsExcelUpload(true);
//                   }}
//                 >
//                   Import
//                 </button>
//               </div>
//               <div className="m-1 float-left">
//                 <button
//                   className="bg-blue-600"
//                   onClick={downloadExcel}
//                 >
//                   Export
//                 </button>
//               </div>
//               <div className="m-1 float-left">
//                 <button
//                   className="bg-green-600"
//                   onClick={() => {
//                     setIsExcelUpload(false);
//                   }}
//                 >
//                   Create
//                 </button>
//               </div>
//               <div className="m-1 float-left">
//                 <p>
//                   Selected Count :  {SelectedProgrammes.length}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex">
//             <div className={`grid  gap-4 w-full transition-all grid-cols-4`} >
//               {currentData?.map((item: Programme, index: number) => {

//                 return (
//                   <div
//                     key={index}
//                     className={`w-full h-full bg-base-100  transition-all rounded-lg mt-[1%] cursor-pointer ${
//                       SelectedProgrammes.includes(item.programCode as string) ?' bg-red-400':'bg-base-100'
//                     }`}
//                     onClick={() => {
//                       setSelectedProgramme(item);
//                       setIsExcelUpload(false);
//                       if(SelectedProgrammes.includes(item.programCode as string)){

//                       const deletedPrpgrammesData :  string[] = SelectedProgrammes.filter((programCode :string) => {
//                           return programCode != item.programCode
//                         });

//                         setSelectedProgrammes(deletedPrpgrammesData as string[]);
//                       }else{
//                         setSelectedProgrammes([...SelectedProgrammes as string[] , item.programCode as string]);
//                       }

//                       console.log(SelectedProgrammes);

//                     }}
//                   >
//                     <div className="">
//                       <p className="text-base-content">{item.name}</p>
//                     </div>
//                     <div className=" ">
//                       <p className="text-base-content">{item.programCode}</p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//           <div className="w-full flex items-center justify-center">
//             {renderPaginationControls()}
//           </div>
//         </div>
//       </div>

//     </>
//   );
// };

// export default withUrqlClient(() => ({
//   url: SERVER_URL,
//   exchanges: [fetchExchange, cacheExchange],
//   fetchOptions: {
//     cache: "no-cache",
//     credentials: "include",
//   },
// }))(Result);

"use client";
import ResultBar from "../ResultBar";
import InfoBar from "@/components/admin/InfoBar";
import RightSideBar from "@/components/admin/RightSideBar";
import { Programme, Category, Team, Skill } from "@/gql/graphql";
import { parseJwt } from "@/lib/cryptr";
import { SERVER_URL } from "@/lib/urql";
import { withUrqlClient } from "next-urql";
import { useEffect, useRef, useState } from "react";
import { cacheExchange, fetchExchange } from "urql";
import OneResult from "./SingleResult";
import { styled } from "styled-components";
import { ChevronLeft } from "@/icons/arrows";
import { PageChevronLeft, PageChevronRight } from "@/icons/pagination";

interface Props {
  data: {
    title: string;
    icon: any;
  }[];
  result: Programme[];
  categories: Category[];
  skills: Skill[];
}
// styled components

const ComponentsDiv: any = styled.div<{ height: string }>`
  width: 100%;
  overflow: auto;
  height: 75%;

  @media (min-width: 1024px) {
    width: 100%;
    height: ${(props) => (props.height ? props.height : "100%")};
  }
`;

const DetailedDiv: any = styled.div<{ height: string }>`
  width: 100%;
  height: 100vh;
  display: flex;
  margin-top: 3%;

  @media (min-width: 1024px) {
    height: ${(props) => (props.height ? props.height : "75vh")};
  }
`;

const Result = (props: Props) => {
  const [allData, setAllData] = useState<Programme[]>(props.result);
  const [IsRightSideBarOpen, setIsRightSideBarOpen] = useState(false);
  const [SelectedProgramme, setSelectedProgramme] = useState<Programme>();
  const [isExcelUpload, setExcel] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<Programme[]>(props.result);
  const [currentPage, setCurrentPage] = useState(1);
  const [isImageUpload, setIsImageUpload] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(7);
  const [screenHeigh, setScreenHeight] = useState<number>(400);
  const [SelectedProgrammes, setSelectedProgrammes] = useState<string[]>([]);
  const ProgrammeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cookie = document.cookie;
    if (cookie) {
      const token = cookie.split("=")[1];
      const cv = parseJwt(token);
      setData(
        props.result.filter((item: any) =>
          cv.categories?.includes(item.category.name)
        ) as Programme[]
      );
      setAllData(
        props.result.filter((item: any) =>
          cv.categories?.includes(item.category.name)
        ) as Programme[]
      );
    }

    // window height settings
    const windowWidth = window.innerWidth;

    setItemsPerPage(calculateBreakPoint(window.innerHeight));

    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    // Attach the event listener when the component mounts
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const windowWidth = window.innerWidth;
    console.log(windowWidth);

    if (IsRightSideBarOpen) {
      setItemsPerPage((calculateBreakPoint(window.innerHeight) / 4) * 3);
    } else {
      setItemsPerPage(calculateBreakPoint(window.innerHeight));
      setCurrentPage(1);
    }
  }, [IsRightSideBarOpen]);

  useEffect(() => {
    // when screen height changes

    console.log(screenHeigh);
    setIsRightSideBarOpen(false);

    const shh = calculateBreakPoint(window.innerHeight);

    setItemsPerPage(shh);
    console.log(shh);
  }, [screenHeigh]);

  const calculateBreakPoint = (sh: number) => {
    return Math.floor((sh + 30 - 300) / 100) * 4;
  };

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the data for the current page
  const currentData = data.slice(startIndex, endIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Go to a specific page number
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Render the pagination controls
  const renderPaginationControls = () => {
    const controls = [];
    for (let page = 1; page <= totalPages; page++) {
      controls.push(
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`${
            currentPage === page ? "bg-secondary text-white" : "bg-[#ECE1FC]"
          }  py-2 px-4 rounded-xl font-bold mx-1 my-5`}
        >
          {page}
        </button>
      );
    }
    return controls;
  };

  function downloadExcel() {
    const data = props.result;
    const replacer = (key: any, value: any) => (value === null ? "" : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map((row: any) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    );
    csv.unshift(header.join(","));
    let csvArray = csv.join("\r\n");

    var a = document.createElement("a");
    a.href = "data:attachment/csv," + csvArray;
    a.target = "_Blank";
    a.download = "Programme.csv";
    document.body.appendChild(a);
    a.click();
  }

  return (
    <>
      <div className="w-full h-full">
      <ResultBar data={[
        {
          title: "A",
          totalPoints: 1,
          selectedPoints : 1
        },
        {
          title: "B",
          totalPoints: 1,
          selectedPoints : 1
        }, {
          title: "C",
          totalPoints: 1,
          selectedPoints : 1
        }, {
          title: "D",
          totalPoints: 1,
          selectedPoints : 1
        },
      ]} />

        <DetailedDiv
          height={`${(itemsPerPage / (IsRightSideBarOpen ? 3 : 4)) * 6 + 8}rem`}
        >
          <div className="flex-1 h-full">
            <div className="h-10 cursor-pointer flex justify-between mb-4">
              <input
                type="text"
                placeholder="Search"
                className="w-1/3 lg:w-1/4 rounded-full bg-[#EEEEEE] px-5 text-xl border-secondary"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                  setData(
                    allData.filter((item: any) =>
                      item.name
                        .toLocaleLowerCase()
                        .includes(e.target.value.toLocaleLowerCase())
                    )
                  );
                }}
              />

              <div>
              <button
                  className="ml-1 bg-secondary text-white rounded-full px-5 py-2 font-bold"
                  onClick={downloadExcel}
                >
                   {SelectedProgrammes.length} Selected
                </button>
                <button
                  className="ml-1 bg-secondary text-white rounded-full px-5 py-2 font-bold"
                  onClick={downloadExcel}
                >
                  Export
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center lg:justify-center w-full h-full">
              <ComponentsDiv
                height={`${
                  (itemsPerPage / (IsRightSideBarOpen ? 3 : 4)) * 6
                }rem`}
              >
                <div
                  ref={ProgrammeRef}
                  className={`grid gap-4 w-full transition-all grid-cols-1 ${
                    IsRightSideBarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"
                  }`}
                >
                  {currentData?.map((item: Programme, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`transition-all bg-[#EEEEEE] rounded-xl mt-[1%] cursor-pointer flex p-5 gap-3 content-center items-center h-20 ${
                          SelectedProgrammes.includes(
                            item.programCode as string
                          )
                            ? "bg-[#e1c7f9]"
                            : "inherit"
                        }`}
                        onClick={() => {
                          // setIsRightSideBarOpen(true);
                          setSelectedProgramme(item);
                          setIsEdit(false);
                          setIsCreate(false);
                          setExcel(false);
                          setIsImageUpload(false);

                          if (
                            SelectedProgrammes.includes(
                              item.programCode as string
                            )
                          ) {
                            const deletedPrpgrammesData: string[] =
                              SelectedProgrammes.filter(
                                (programCode: string) => {
                                  return programCode != item.programCode;
                                }
                              );

                            setSelectedProgrammes(
                              deletedPrpgrammesData as string[]
                            );
                          } else {
                            setSelectedProgrammes([
                              ...(SelectedProgrammes as string[]),
                              item.programCode as string,
                            ]);
                          }

                          console.log(SelectedProgrammes);
                        }}
                      >
                        <div className="text-white font-bold bg-secondary px-3 py-1 text-xl rounded-xl flex justify-center content-center items-center">
                          <p> {item.programCode}</p>
                        </div>

                        <p className="text-black leading-5 pr-[10%]">
                          {item.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </ComponentsDiv>
              <div className="w-full flex items-center justify-center">
                <button
                  key={1}
                  onClick={() => {
                    currentPage != 1 && goToPage(currentPage - 1);
                  }}
                  className={`${"bg-[#ECE1FC]"}  py-2 px-2  rounded-xl font-bold mx-1 my-5`}
                >
                  {<PageChevronLeft className="w-6 h-6 fill-secondary" />}
                </button>
                <button
                  key={1}
                  className={`${"bg-secondary text-white"}  py-2 px-4 rounded-xl font-bold mx-1 my-5`}
                >
                  {currentPage}
                </button>
                <button
                  key={1}
                  onClick={() =>
                    totalPages > currentPage && goToPage(currentPage + 1)
                  }
                  className={`${"bg-[#ECE1FC]"}  py-2 px-2  rounded-xl font-bold mx-1 my-5`}
                >
                  <PageChevronRight className="w-6 h-6 fill-secondary" />
                </button>
              </div>
            </div>
          </div>
        
        </DetailedDiv>
      </div>
    </>
  );
};

export default withUrqlClient(() => ({
  url: SERVER_URL,
  exchanges: [fetchExchange, cacheExchange],
  fetchOptions: {
    cache: "no-cache",
    credentials: "include",
  },
}))(Result);

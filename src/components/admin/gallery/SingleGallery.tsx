"use client";
import Modal from "@/components/Modal";
import {
  Section,
  DeleteSectionDocument,
  DeleteSectionMutation,
  DeleteSectionMutationVariables,
  GetOneSectionDocument,
  GetOneSectionQuery,
  GetOneSectionQueryVariables,
} from "@/gql/graphql";
import { useState } from "react";
import { OperationResult, useMutation, useQuery } from "urql";
import EditSection from "./EditGallery";
import CreateSection from "./CreateGallery";
import { DeleteIcon, EditIcon } from "@/icons/action";
import { API_KEY } from "@/lib/env";
import { Category } from "@/icons/navs"

interface Props {
  id: number;
  name: string;
  isCreate: boolean;
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  data: Section[];
  setData: React.Dispatch<React.SetStateAction<Section[]>>;

  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const OneSection = (props: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [{ fetching, data }] = useQuery<
    GetOneSectionQuery,
    GetOneSectionQueryVariables
  >({
    query: GetOneSectionDocument,
    variables: {
      id: props.id,
      api_key : API_KEY
    },
    pause: props.isEdit && !props.isCreate,
  });

  const [state, DeleteSectionExecute] = useMutation(DeleteSectionDocument);

  const HandleDelete = async () => {
    const deletedData: OperationResult<
      DeleteSectionMutation,
      DeleteSectionMutationVariables
    > = await DeleteSectionExecute({
      id: props.id,
    });

    if (deletedData.data?.removeSection?.__typename) {
      const deleted = props.data.filter((value, index) => {
        return value.id !== props.id;
      });

      props.setData(deleted);
      props.setIsOpen(false);
    }
    setModalOpen(false);
  };

  const Section = data?.section;

  return (
    <div className="w-full h-full">
      {props.isEdit ? (
        <EditSection
          isOpen={props.isEdit}
        
          key={1}
          setIsEdit={props.setIsEdit}
          isEdit={props.isEdit}
          name={Section?.name as string}
          id={Section?.id as number}
          data={props.data}
          setData={props.setData}
          
        />
      ) : props.isCreate ? (
        <CreateSection   isOpen={props.isEdit} key={2} data={props.data} setData={props.setData} />
      ) : (
        <div className="w-full h-full">
          {fetching ? (
            <p> loading... </p>
          ) : (
            <div className="w-full h-full flex flex-col justify-between">
            
              <div className="relative top-15 flex flex-col items-center justify-center gap-4">
              

              <div  className="flex flex-col gap-2 w-full">
              <p className="text-base text-[#8D8D8D]" >Name</p>
              <p className="input input-bordered input-secondary w-full max-w-xs pt-2 text-[#3F127A] border-none">{Category?.name}</p>
              
              </div>
             
          
             
            </div>
              <div className="w-full mt-4 flex items-center justify-between">
              <div
            className="w-1/2 flex items-center justify-center tooltip"
            data-tip="Back"
          ></div>
                <div className="w-1/2 flex items-center justify-around">
                  <button
                    className=" border-2 text-white px-3 py-2 border-secondary rounded-xl font-bold"
                    onClick={() => {
                      props.setIsEdit(true);
                      props.setIsCreate(false);
                      
                    }}
                  >
                    <EditIcon className="w-6 h-6 cursor-pointer fill-secondary  transition-all" />
                  </button>
                  <button
                    className=" border-2 text-white px-3 py-2 border-secondary rounded-xl font-bold"
                    onClick={() => setModalOpen(true)}
                  >
                    <DeleteIcon className="w-6 h-6 cursor-pointer fill-secondary  transition-all" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} key={3}>
        <p>Are you sure Do you want to Delete ?</p>
        <button className="bg-red-600" onClick={HandleDelete}>
          Delete
        </button>
        <button className="bg-blue-500" onClick={() => setModalOpen(false)}>
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default OneSection;

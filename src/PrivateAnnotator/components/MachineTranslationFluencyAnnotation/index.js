import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MachineTranslationFluencyAnnotationComponent from "../../../shared/components/MachineTranslationFluencyAnnotationComponent";
import { useToast, Box, SkeletonText, Heading, Text } from "@chakra-ui/react";
import { createPrivateAnnotatorAnnotation } from "../../../features/private-annotator/thunk";

export default function MachineTranslationFluencyAnnotation({
  privateAnnotatorToken,
}) {
  const [unannotatedId, setUnannotatedId] = useState(null);
  const [dataToBeAnnotated, setDataToBeAnnotated] = useState(null);
  const [done, setDone] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();
  const unannotated = useSelector(
    (state) => state.privateAnnotator.unannotated
  );
  const characterLevelSelection = useSelector(
    (state) =>
      state.privateAnnotator.privateAnnotator.character_level_annotation
  );
  useEffect(() => {
    if (unannotated.length === 0) {
      setDone(true);
      return;
    }
    setUnannotatedId(unannotated[0].id);
    setDataToBeAnnotated({
      MTSystemTranslation: unannotated[0].text,
    });
  }, [unannotated]);

  const submitLogic = (data) => {
    if (data.fluency === undefined) {
      toast({
        title: "Submission error",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
      return;
    }
    dispatch(
      createPrivateAnnotatorAnnotation([
        privateAnnotatorToken,
        unannotatedId,
        data,
      ])
    ).then(() => {
      toast({
        title: "Submitted! Good job!",
        status: "success",
        duration: 3500,
        isClosable: true,
      });
    });
  };

  if (done) {
    return (
      <Text fontSize="3xl" textAlign="center">
        There are no more texts to be annotated! Good job!
      </Text>
    );
  }

  return (
    <>
      <MachineTranslationFluencyAnnotationComponent
        translationData={dataToBeAnnotated}
        submit={submitLogic}
        characterLevelSelection={
          characterLevelSelection !== undefined &&
          characterLevelSelection !== null &&
          characterLevelSelection === true
        }
      />
      <Text
        textTransform="uppercase"
        fontSize="1xs"
        paddingBottom="10"
        paddingLeft="5"
        // fontWeight="bold"
        textAlign="center"
      >
        Texts left to be annotated: {unannotated.length}
      </Text>
    </>
  );
}

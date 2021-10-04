import React, { useReducer, createContext, useEffect } from "react";
import { zooniverseApi} from "zooApi";
import {Subject,SubjectMeta,Classification,Annotation} from 'shared/types'

interface ClassificationState {
  currentClasification?: Classification;
  subjectQueue: Subject[];
  currentSubjectId?: string;
}

export enum ClassifcationActionType {
  LoadSubjects = "LoadSubects",
  SetCurrentSubject = "SetCurrentSubject",
  NextSubject = "NextSubject"
}

const IntialClassificationState: ClassificationState = {
  currentClasification: undefined,
  subjectQueue: [],
  currentSubjectId: undefined,
};

type LoadSubjects = {
  type: ClassifcationActionType.LoadSubjects;
  payload: Subject[];
};

type SetCurrentSubject = {
  type: ClassifcationActionType.SetCurrentSubject;
  payload: string;
};

type NextSubject= {
  type: ClassifcationActionType.NextSubject;
  payload: null;
};

type ClassificationAction = LoadSubjects | SetCurrentSubject | NextSubject;

export const ClassificationContext = createContext<{
  state: ClassificationState;
  dispatch: React.Dispatch<ClassificationAction>;
}>({
  state: IntialClassificationState,
  dispatch: () => null,
});

function reducer(state: ClassificationState, action: ClassificationAction) {
  switch (action.type) {
    case ClassifcationActionType.LoadSubjects:
      return {
        ...state,
        subjectQueue: action.payload,
      };
    case ClassifcationActionType.SetCurrentSubject:
      return {
        ...state,
        currentSubjectId: action.payload,
      };
    case ClassifcationActionType.NextSubject:
      return{
        ...state,
        subjectQueue: state.subjectQueue.filter(s=>s.id !== state.currentSubjectId),
        currentSubjectId: state.subjectQueue.filter(s=>s.id !== state.currentSubjectId)[0].id
      }
    default:
      return state;
  }
}

export const ClassificationProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, IntialClassificationState);

  useEffect(() => {
    if (state.subjectQueue.length === 0) {
      zooniverseApi(
        "/subjects/queued?http_cache=true&workflow_id=19094",
        {}
      ).then((resp) => {
        const {subjects} = resp
        console.log("updating subjects ", subjects)
        dispatch({
          type: ClassifcationActionType.LoadSubjects,
          payload: subjects,
        });
        dispatch({
          type: ClassifcationActionType.SetCurrentSubject,
          payload: subjects[0].id,
        });
      });
    }
  }, [state.subjectQueue]);

  useEffect(() => {
    console.log("Classification state updated ", state);
  }, [state]);

  return (
    <ClassificationContext.Provider value={{ state, dispatch }}>
      {children}
    </ClassificationContext.Provider>
  );
};

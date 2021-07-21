import {useContext} from 'react'
import {ClassificationContext, ClassifcationActionType } from 'Contexts/ClassificationContext'

export const useCurrentSubject= () => {
  const {state, dispatch} = useContext(ClassificationContext)
  const nextSubject = ()=>{
    dispatch({
      type: ClassifcationActionType.NextSubject,
      payload:null
    })
  }
  const currentSubject = state.subjectQueue.find((s)=> s.id === state.currentSubjectId)
  return {currentSubject, nextSubject}
};

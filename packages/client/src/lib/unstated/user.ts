import React from 'react'
import { createContainer } from "unstated-next"
import { UserData, UTM } from '../../common'

const localStorageKey = 'user-data'

// https://medium.com/@jrcreencia/persisting-redux-state-to-local-storage-f81eb0b90e7e
const loadLocalStorage = (): Partial<UserData> => {
  const serialized = localStorage.getItem(localStorageKey)
  if (serialized === null) return {}
  try {
    return JSON.parse(serialized) as Partial<UserData>
  } catch (e) {
    return {}
  }
}

const saveLocalStorage = (userData: UserData): void => {
  const serialized = JSON.stringify(userData)
  localStorage.setItem(localStorageKey, serialized)
}

const randomUserId = () => {
  // https://gist.github.com/6174/6062387
  return Math.random().toString(36).substring(2, 15)
}

const defaultInitialState = { uid: randomUserId() }

/** Set initial state without overwriting data in localStorage */
const useUserContainer = (initialState: UserData = defaultInitialState) => {
  const existingUserData = loadLocalStorage()
  const [userData, setUserData] = React.useState<UserData>({
    ...(initialState ?? {}),
    ...existingUserData 
  })

  /** Non-overwriting update of user data */
  const conservativeUpdateUserData = (utm: UTM) => {
    const newUserData = {...utm, ...userData}
    saveLocalStorage(newUserData)
    setUserData(newUserData)
  }
  return { userData, conservativeUpdateUserData }
}

export const UserContainer = createContainer(useUserContainer)

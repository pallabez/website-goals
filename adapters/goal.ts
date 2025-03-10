import axios from 'axios'
import * as goalAdapter from './goal.transformer'
import { type Goal } from '~/interfaces/Goal'
import { type PostGoal } from '~/interfaces/PostGoal'
import { getConfig } from '~/config/index'

const goalSiteConfig = {
  headers: {
    'Content-Type': 'application/vnd.api+json'
  }
}

export const fetchGoals = async (): Promise<Goal[]> => {
  const config = getConfig();

  const goals: Goal[] = await axios
    .get(`${config.GOALS_API}/v1/goal/`)
    .then((res) => goalAdapter.transformGoalsFromApi(res.data.data))
    .catch((error) => {
      throw new Error(error)
    })

  return goals
}

export const fetchGoalById = async (goalId: string): Promise<Goal> => {
  const config = getConfig();

  const goal: Goal = await axios
    .get(`${config.GOALS_API}/v1/goal/${goalId}/`)
    .then((res) => goalAdapter.transformGoalFromApi(res.data.data))

  return goal
}

export const addGoal = async (goal: PostGoal): Promise<Goal> => {
  const config = getConfig();

  const goalResponse = await axios
    .post(
      `${config.GOALS_API}/v1/goal/`,
      {
        data: {
          type: 'Goal',
          attributes: goal
        }
      },
      goalSiteConfig
    )
    .then((res) => goalAdapter.transformGoalFromApi(res.data.data))

  return goalResponse
}

export const deleteGoal = async (goalId: string): Promise<void> => {
  const config = getConfig();
  await axios
    .delete(
      `${config.GOALS_API}/v1/goal/${goalId}/`,
      goalSiteConfig,
    )
}

export const updateGoal = async (
  goalId: string,
  goal: PostGoal
): Promise<Goal> => {
  if (!goalId) throw Error("GoalId not defined");
  const config = getConfig();
  const goalResponse = await axios
    .patch(
      `${config.GOALS_API}/v1/goal/${goalId}/`,
      {
        data: {
          id: goalId,
          type: 'Goal',
          attributes: goalAdapter.transformGoalAttributesToApi(goal)
        }
      },
      goalSiteConfig
    )
    .then((res) => goalAdapter.transformGoalFromApi(res.data.data))

  return goalResponse
}

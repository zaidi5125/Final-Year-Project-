import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchCourses, createCourse, updateCourse as updateCourseApi, assignCourseMember } from '@/services/courseService'
import { fetchRoles } from '@/services/userService'
import { showError, showSuccess } from '@/utils/toast'

const TrainingContext = createContext(null)

function mapCourse(c) {
  return {
    id: c.id,
    name: c.name,
    courseId: c.course_id,
    startDate: c.start_date,
    endDate: c.end_date,
    description: c.description || '',
    status: c.status,
    participants: [],
    trainers: [],
    mediators: [],
    members: c.members || [],
    files: [],
    totalMembers: c.total_members || 0,
  }
}

export function TrainingProvider({ children }) {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [roles, setRoles] = useState([])

  const loadCourses = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchCourses()
      setCourses(data.map(mapCourse))
    } catch {
      showError('Could not load courses.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCourses()
    fetchRoles().then(setRoles).catch(() => setRoles([]))
  }, [loadCourses])

  function findRoleId(roleName) {
    const role = roles.find((r) => r.name.toLowerCase() === roleName.toLowerCase())
    return role ? role.id : null
  }

  const addCourse = useCallback(async (courseData) => {
    if (!courseData.courseName || !courseData.courseName.trim()) {
      showError('Course name is required.')
      return null
    }
    try {
      const created = await createCourse({
        name: courseData.courseName.trim(),
        course_id: courseData.courseId || '',
        start_date: courseData.startDate || null,
        end_date: courseData.endDate || null,
        description: courseData.description || '',
        status: courseData.status || 'upcoming',
      })

      const participantRoleId = findRoleId('Participant')
      const trainerRoleId = findRoleId('Team Member')
      const mediatorRoleId = findRoleId('Mediator')

      const participants = courseData.participants || []
      for (let i = 0; i < participants.length; i++) {
        if (participants[i].userId && participantRoleId) {
          try {
            await assignCourseMember(created.id, participants[i].userId, participantRoleId)
          } catch {
            // continue
          }
        }
      }

      const trainers = courseData.trainers || []
      for (let i = 0; i < trainers.length; i++) {
        if (trainerRoleId) {
          try {
            await assignCourseMember(created.id, trainers[i].id, trainerRoleId)
          } catch {
            // continue
          }
        }
      }

      const mediators = courseData.mediators || []
      for (let i = 0; i < mediators.length; i++) {
        if (mediatorRoleId) {
          try {
            await assignCourseMember(created.id, mediators[i].id, mediatorRoleId)
          } catch {
            // continue
          }
        }
      }

      await loadCourses()
      showSuccess('Course created successfully.')
      return mapCourse(created)
    } catch (error) {
      showError('Could not create course.')
      return null
    }
  }, [loadCourses, roles])

  const updateCourse = useCallback(async (id, data) => {
    try {
      await updateCourseApi(id, {
        name: data.courseName,
        course_id: data.courseId,
        start_date: data.startDate,
        end_date: data.endDate,
        description: data.description,
        status: data.status,
      })
      await loadCourses()
      showSuccess('Course updated successfully.')
    } catch {
      showError('Could not update course.')
    }
  }, [loadCourses])

  const getCourseById = useCallback(
    function (id) {
      return courses.find(function (course) { return String(course.id) === String(id) })
    },
    [courses],
  )

  const value = useMemo(
    function () {
      return {
        courses: courses,
        isLoading: isLoading,
        foundationalRecords: [],
        addCourse: addCourse,
        updateCourse: updateCourse,
        getCourseById: getCourseById,
      }
    },
    [courses, isLoading, addCourse, updateCourse, getCourseById],
  )

  return (
    <TrainingContext.Provider value={value}>{children}</TrainingContext.Provider>
  )
}

export function useTraining() {
  const context = useContext(TrainingContext)
  if (!context) {
    throw new Error('useTraining must be used within a TrainingProvider')
  }
  return context
}

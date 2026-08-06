import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable, EmptyState, Modal, PageHeader } from '@/components/shared'
import UserForm from '@/features/accounts/components/UserForm'
import { fetchUsers, fetchRoles, createUser, updateUser, deactivateUser } from '@/services/userService'
import { showError, showSuccess } from '@/utils/toast'

export default function ManageUsersPage() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [searchParams] = useSearchParams()

  async function loadData() {
    setIsLoading(true)
    try {
      const [usersData, rolesData] = await Promise.all([fetchUsers(), fetchRoles()])
      setUsers(usersData)
      setRoles(rolesData)
    } catch {
      showError('Could not load users.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchParams.get('add') === '1') {
      setEditingUser(null)
      setIsModalOpen(true)
    }
  }, [searchParams])

  function openCreateModal() {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  function openEditModal(user) {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  async function handleSubmit(formValues) {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formValues)
        showSuccess('User updated successfully.')
      } else {
        await createUser(formValues)
        showSuccess('User created successfully. Default password: Welcome@123')
      }
      setIsModalOpen(false)
      loadData()
    } catch (error) {
      const message =
        error.response?.data?.username?.[0] ||
        error.response?.data?.detail ||
        'Could not save user.'
      showError(message)
    }
  }

  async function handleDeactivate(user) {
    if (!window.confirm(`Deactivate user "${user.username}"?`)) return
    try {
      await deactivateUser(user.id)
      showSuccess('User deactivated.')
      loadData()
    } catch {
      showError('Could not deactivate user.')
    }
  }

  const columns = [
    { key: 'username', header: 'Username' },
    { key: 'email', header: 'Email' },
    {
      key: 'roles',
      header: 'Roles',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {(row.roles ?? []).length === 0 ? (
            <span className="text-xs text-muted-foreground">No role</span>
          ) : (
            row.roles.map((role) => (
              <Badge key={role} variant="secondary">{role}</Badge>
            ))
          )}
        </div>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'muted'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => openEditModal(row)}>
            Edit
          </Button>
          {row.isActive && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => handleDeactivate(row)}
            >
              Deactivate
            </Button>
          )}
        </div>
      ),
    },
  ]

  const isEmpty = !isLoading && users.length === 0

  return (
    <section aria-label="Manage Users" className="flex flex-col gap-6">
      <PageHeader
        title="Manage Users"
        description="Create users and assign roles across the portal."
        actions={
          <Button onClick={openCreateModal}>
            <Plus className="size-4" aria-hidden="true" />
            Add User
          </Button>
        }
      />

      <Card>
        <CardContent className={isEmpty ? 'p-0' : 'p-0 pt-6'}>
          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Loading users...</p>
          ) : isEmpty ? (
            <EmptyState
              icon={Users}
              title="No users yet"
              description="Add your first user and assign them a role."
              action={
                <Button onClick={openCreateModal}>
                  <Plus className="size-4" aria-hidden="true" />
                  Add User
                </Button>
              }
            />
          ) : (
            <DataTable columns={columns} data={users} />
          )}
        </CardContent>
      </Card>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add User'}
        description={
          editingUser
            ? 'Update user details and roles.'
            : 'New users get a default password: Welcome@123'
        }
      >
        <UserForm
          initialValues={editingUser}
          roles={roles}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </section>
  )
}




import { Button } from '@/components/ui/button'; // or your button import path
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()



  return (
    <>
      <h1>Dashboard</h1>
      <Button onClick={() => navigate('/quiz')}>
        Click
      </Button>
    </>
  )
}

export default Dashboard

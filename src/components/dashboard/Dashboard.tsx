import Layout from "@/components/layout/Layout";
import DogProfile from "@/components/dashboard/DogProfile";
import RecentSchedule from "@/components/dashboard/RecentSchedule";

export default function Dashboard() {
  return (
    <Layout>
      <DogProfile />
      <RecentSchedule />
    </Layout>
  )
}

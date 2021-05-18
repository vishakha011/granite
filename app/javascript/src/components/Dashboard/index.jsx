import React, { useState, useEffect } from "react";
import { isNil, isEmpty, either } from "ramda";

import Container from "components/Container";
import ListTasks from "components/Tasks/ListTasks";
import PageLoader from "components/PageLoader";
import tasksApi from "apis/tasks";

const Dashboard = ({ history }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await tasksApi.list();
      setTasks(response.data.tasks);
      setLoading(false);
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  const showTask = slug => {
    history.push(`/tasks/${slug}/show`);
  };

  const updateTask = slug => {
    history.push(`/tasks/${slug}/edit`);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen">
        <PageLoader />
      </div>
    );
  }

  if (either(isNil, isEmpty)(tasks)) {
    return (
      <Container>
        <h1 className="text-xl leading-5 text-center">
          You have no tasks assigned 😔
        </h1>
      </Container>
    );
  }

  return (
    <Container>
      <ListTasks
        data={tasks}
        updateTask={updateTask}
        showTask={showTask}
        // destroyTask={destroyTask}
      />
    </Container>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import { all, isNil, isEmpty, either } from "ramda";

import Container from "components/Container";
import Table from "components/Tasks/Table";
import PageLoader from "components/PageLoader";
import tasksApi from "apis/tasks";
import { setAuthHeaders } from "apis/axios";

const Dashboard = ({ history }) => {
  // const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      setAuthHeaders();
      const response = await tasksApi.list();
      // setTasks(response.data.tasks);
      const { pending, completed } = response.data.tasks;
      setPendingTasks(pending);
      setCompletedTasks(completed);
      setLoading(false);
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  const handleProgressToggle = async ({ slug, progress }) => {
    try {
      await tasksApi.update({ slug, payload: { task: { progress } } });
      await fetchTasks();
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  const showTask = slug => {
    history.push(`/tasks/${slug}/show`);
  };

  // const updateTask = slug => {
  //   history.push(`/tasks/${slug}/edit`);
  // };

  const destroyTask = async slug => {
    try {
      await tasksApi.destroy(slug);
      await fetchTasks();
    } catch (error) {
      logger.error(error);
    }
  };

  const starTask = async (slug, status) => {
    try {
      const toggledStatus = status === "starred" ? "unstarred" : "starred";
      await tasksApi.update({
        slug,
        payload: { task: { status: toggledStatus } },
      });
      await fetchTasks();
    } catch (error) {
      logger.error(errpr);
    }
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

  if (all(either(isNil, isEmpty), [pendingTasks, completedTasks])) {
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
      {!either(isNil, isEmpty)(pendingTasks) && (
        <Table
          data={pendingTasks}
          destroyTask={destroyTask}
          showTask={showTask}
          handleProgressToggle={handleProgressToggle}
          starTask={starTask}
        />
      )}
      {!either(isNil, isEmpty)(completedTasks) && (
        <Table
          type="completed"
          data={completedTasks}
          destroyTask={destroyTask}
          handleProgressToggle={handleProgressToggle}
        />
      )}
    </Container>
  );
};

export default Dashboard;

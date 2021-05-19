import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Container from "components/Container";
import TaskForm from "./Form/TaskForm";
import PageLoader from "components/PageLoader";
import Toastr from "components/Common/Toastr";
import tasksApi from "../../apis/tasks";

const EditTask = ({ history }) => {
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { slug } = useParams();

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await tasksApi.update({
        slug,
        payload: { task: { title, user_id: userId } },
      });
      setLoading(false);
      Toastr.success("Successfully updated task.");
      history.push("/dashboard");
    } catch (error) {
      setLoading(false);
      logger.error(error);
    }
  };

  const fetchTaskDetails = async () => {
    try {
      const response = await tasksApi.show(slug);
      // logger.info(response)
      setTitle(response.data.task.title);
      setUserId(response.data.task.user_id);
    } catch (error) {
      logger.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, []);

  if (pageLoading) {
    return (
      <div className="w-screen h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <Container>
      <TaskForm
        type="update"
        title={title}
        userId={userId}
        setTitle={setTitle}
        setUserId={setUserId}
        loading={loading}
        handleSubmit={handleSubmit}
      />
    </Container>
  );
};

export default EditTask;
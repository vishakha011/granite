class TasksController < ApplicationController
end
class TasksController < ApplicationController
  def index
    @tasks = Task.all
  end
end
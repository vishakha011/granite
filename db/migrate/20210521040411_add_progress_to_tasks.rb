class AddProgressToTasks < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :progress, :integer, default: 0, null: false
    #Ex:- add_column("admin_users", "username", :string, :limit =>25, :after => "email")
  end
end

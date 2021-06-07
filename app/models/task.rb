class Task < ApplicationRecord
  enum progress: {pending: 0, completed: 1}
  enum status: {unstarred: 0, starred: 1}
  
  belongs_to :user
  has_many :comments, dependent: :destroy

  validates :title, presence: true, length: { maximum:50 }
  validates :slug, uniqueness: true
  validate :slug_not_changed
  

  before_create :set_slug
  after_create :log_task_details

  after_commit :log_task_details, on: :create

  private

  def set_slug
    itr = 1
    loop do
      title_slug = title.parameterize
      slug_candidate = itr > 1 ? "#{title_slug}-#{itr}" : title_slug
      break self.slug = slug_candidate unless Task.exists?(slug: slug_candidate)
      itr += 1
    end
  end

  def slug_not_changed
    if slug_changed? && self.persisted?
      errors.add(:slug, t('task.slug.immutable'))
    end
  end

  def self.organize(progress)
    starred = send(progress).starred.order('updated_at DESC');
    unstarred = send(progress).unstarred
    starred + unstarred
  end

  def log_task_details
    TaskLoggerJob.perform_later(self)
  end
end
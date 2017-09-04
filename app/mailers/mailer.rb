class Mailer < ActionMailer::Base
  layout "mailer"

  default from: Rails.application.secrets.mailer_default_from_email

  default_url_options[:host] = Rails.application.secrets.host

  def contact_us_notification(contact)
    @email = contact.email
    @title = contact.title
    @body  = contact.body
    subject = "Contact us message from #{@email}"

    mail(to: Rails.application.secrets.support_email, from: @email,  subject: subject) do |format|
      format.html
    end
  end
end

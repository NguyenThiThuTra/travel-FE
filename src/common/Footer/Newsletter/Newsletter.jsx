import React from 'react';
import './_Newsletter.scss';
import { useForm } from 'react-hook-form';
const Newsletter = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  const onSubmit = (data, e) => {
    console.log(data);
    e.target.reset(); // reset after form submit
  };
  return (
    <div className="Newsletter">
      <h3 className="Newsletter__title">Nhận tin</h3>
      <p className="Newsletter__content">
        Nhận thông tin cập nhật kịp thời từ các phòng yêu thích của bạn
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form_support"
        autoComplete="off"
      >
        {/* eslint-disable */}
        <div style={{ width: '100%' }}>
          <input
            {...register('email', {
              required: true,
              pattern: {
                value:
                  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                message:
                  'Your email address is invalid. Please enter a valid address !',
              },
            })}
            className=" form-input form_support__input_form "
            placeholder="Ex: example@email.com"
          />
          {errors.email && (
            <p className="error_message">{errors?.email?.message}</p>
          )}
        </div>
        {/* eslint-enable */}
        <div>
          <input
            style={{ padding: '1.4rem', cursor: 'pointer' }}
            type="submit"
            value="Gửi"
            className="btn form_support__btn"
          />
        </div>
      </form>
    </div>
  );
};

export default Newsletter;

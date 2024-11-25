import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { dateIntervalValidationSchema } from './validation-schema';
import { DateInterval } from '@/types';
import { getErrorMessage } from '@/utils/form-error';
import { Config } from '@/config';
import { useSettingsQuery } from '@/data/settings';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import {
  useCreateDateIntervalMutation,
  useUpdateDateIntervalMutation,
} from '@/data/date-interval';
import DatePickerInput from '../ui/date-picker';

type FormValues = {
  start_date: string;
  end_date: string;
  year: string;
};

const defaultValues = {
  year: '',
  start_date:new Date(),
};

type IProps = {
  initialValues?: DateInterval;
};


export default function DateIntervalCreateOrUpdateForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { locale } = useRouter();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-ignore
    defaultValues: initialValues
    ? {
        ...initialValues,
        start_date: new Date(initialValues.start_date!),
        end_date: new Date(initialValues.end_date!),
      }
    : defaultValues,
    //@ts-ignore
    resolver: yupResolver(dateIntervalValidationSchema),
  });
  const { mutate: createDateInterval, isLoading: creating } =
    useCreateDateIntervalMutation();
  const { mutate: updateDateInterval, isLoading: updating } =
    useUpdateDateIntervalMutation();

  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });
  const isTranslateCoupon = router.locale !== Config.defaultLanguage;
  const [start_date, end_date] = watch(['start_date', 'end_date']);

  const onSubmit = async (values: FormValues) => {
    const input = {
      language: router.locale,
      start_date: new Date(values.start_date).toISOString(),
      end_date: new Date(values.end_date).toISOString(),
      year: values.year,
    };
    try {
      if (!initialValues) {
        createDateInterval({
          ...input,
        });
      } else {
        updateDateInterval({
          ...input,
          id: initialValues.id,
        });
      }
    } catch (error) {
      const serverErrors = getErrorMessage(error);
      Object.keys(serverErrors?.validation).forEach((field: any) => {
        setError(field.split('.')[1], {
          type: 'manual',
          message: serverErrors?.validation[field][0],
        });
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Card className="w-full">
          <div className="flex flex-col sm:flex-row">
            <div className="w-full p-0 mb-5 sm:mb-0 sm:w-1/3 sm:pe-2">
              <DatePickerInput
                control={control}
                name="start_date"
                dateFormat="dd/MM/yyyy"
                maxDate={new Date(end_date)}
                startDate={new Date(start_date)}
                endDate={new Date(end_date)}
                label="Start Date"
                className="border border-border-base"
                error={t(errors.start_date?.message!)}
              />
            </div>
            <div className="w-full p-0 sm:w-1/3 sm:ps-2">
              <DatePickerInput
                control={control}
                name="end_date"
                dateFormat="dd/MM/yyyy"
                startDate={new Date(start_date)}
                endDate={new Date(end_date)}
                minDate={new Date(start_date)}
                label="End Date"
                className="border border-border-base"
                error={t(errors.end_date?.message!)}
              />
            </div>
            <div className="w-full p-0 mb-5 sm:mb-0 sm:w-1/3 sm:ps-2">
              <Input
                label="Year"
                {...register('year')}
                error={t(errors.year?.message!)}
                variant="outline"
                className="mb-5"
                disabled={isTranslateCoupon}
              />
            </div>
          </div>
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="text-end">
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="me-4"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )}

          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues ? 'Update Date Interval' : 'Create Date Interval'}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}

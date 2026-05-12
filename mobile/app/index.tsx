import {Screen, Typography, Button} from '@/shared/ui';
import { View } from 'react-native';

export default function Index() {
  return (
    <Screen className="flex-1 bg-background p-4">
          <Typography variant="title">
            VizorLite
          </Typography>

          <Typography variant="caption">
            общайтесь, планируйте, решайте
          </Typography>

        <View className="gap-3">
          <Button>
            Создать видеовстречу
          </Button>

          <Button variant="secondary">
            Подключиться
          </Button>

          <Button variant="ghost">
            Настройки
          </Button>
        </View>
    </Screen>
  );
}

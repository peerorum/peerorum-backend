package org.springframework.data.util;

import java.util.List;

public interface TypeInformation<S> {
    List<TypeInformation<?>> getTypeArguments();
    Class<S> getType();
}
